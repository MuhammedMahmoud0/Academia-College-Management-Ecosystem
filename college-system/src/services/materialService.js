import apiClient from './apiClient';

/**
 * Get course materials filtered by lecture or tutorial/lab
 * @param {Object} params - Query parameters
 * @param {number} params.lecture_id - Filter by lecture ID (optional)
 * @param {number} params.tutorial_lab_id - Filter by tutorial/lab ID (optional)
 * @returns {Promise} Array of materials
 */
export const getMaterials = async (params = {}) => {
  const response = await apiClient.get('/materials', {
    params,
    validateStatus: (status) => status < 500, // Treat 404 as valid response, not error
  });

  // If 404 (no materials found), return empty array
  if (response.status === 404) {
    return [];
  }

  return response.data;
};

/**
 * Get materials for all lectures of a course (when course has multiple lecture IDs)
 * @param {Array<number>} lectureIds - Array of lecture IDs
 * @returns {Promise} Array of materials from all lectures
 */
export const getMaterialsForCourse = async (lectureIds = []) => {
  if (!lectureIds || lectureIds.length === 0) {
    return [];
  }

  // If only one lecture ID, use the single endpoint
  if (lectureIds.length === 1) {
    return getMaterials({ lecture_id: lectureIds[0] });
  }

  // For multiple lecture IDs, fetch materials for each and combine
  const promises = lectureIds.map(lectureId =>
    getMaterials({ lecture_id: lectureId })
  );

  const results = await Promise.all(promises);

  // Combine all results and remove duplicates by material ID
  const allMaterials = results.flat();
  const uniqueMaterials = Array.from(
    new Map(allMaterials.map(m => [m.id, m])).values()
  );

  return uniqueMaterials;
};

/**
 * Create a new material (Doctor/Admin only)
 * @param {Object} materialData - Material data
 * @param {string} materialData.type - Either 'link' or 'file'
 * @param {number} materialData.lecture_id - Lecture ID (required if tutorial_lab_id is not provided)
 * @param {number} materialData.tutorial_lab_id - Tutorial/Lab ID (required if lecture_id is not provided)
 * @param {string} materialData.title - Material title (required for links)
 * @param {string} materialData.url - Material URL (required when type is 'link')
 * @param {File} materialData.file - File to upload (required when type is 'file')
 * @returns {Promise} Created material data
 */
export const createMaterial = async (materialData) => {
  const formData = new FormData();

  formData.append('type', materialData.type);

  if (materialData.lecture_id) {
    formData.append('lecture_id', materialData.lecture_id);
  }

  if (materialData.tutorial_lab_id) {
    formData.append('tutorial_lab_id', materialData.tutorial_lab_id);
  }

  if (materialData.type === 'link') {
    formData.append('title', materialData.title);
    formData.append('url', materialData.url);
  } else if (materialData.type === 'file' && materialData.file) {
    formData.append('title', materialData.title);
    formData.append('file', materialData.file);
  }

  const response = await apiClient.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Update a material (Doctor/Admin only) - For link materials only
 * @param {number} id - Material ID
 * @param {Object} updateData - Updated material data
 * @param {string} updateData.title - Updated title
 * @param {string} updateData.url - Updated URL
 * @returns {Promise} Updated material data
 */
export const updateMaterial = async (id, updateData) => {
  const response = await apiClient.put(`/materials/${id}`, updateData);
  return response.data;
};

/**
 * Delete a material (Doctor/Admin only)
 * @param {number} id - Material ID
 * @returns {Promise} Success message
 */
export const deleteMaterial = async (id) => {
  const response = await apiClient.delete(`/materials/${id}`);
  return response.data;
};

/**
 * Get download URL for a material
 * Returns a signed URL that expires in 1 hour
 * @param {number} id - Material ID
 * @returns {Promise} Object containing download_url and material info
 */
export const getMaterialDownloadUrl = async (id) => {
  const response = await apiClient.get(`/materials/${id}/download`);
  return response.data;
};

/**
 * Stream/download a material file directly
 * For link materials, redirects to the URL
 * @param {number} id - Material ID
 * @returns {Promise} File blob or redirect
 */
export const streamMaterial = async (id) => {
  const response = await apiClient.get(`/materials/${id}/stream`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * View a material in a new tab
 * For PDFs and viewable files, opens in browser
 * For links, redirects to the URL
 * @param {number} id - Material ID
 * @param {string} type - Material type ('link' or 'file')
 * @param {string} url - Direct URL for link materials
 */
export const viewMaterial = async (id, type, url) => {
  if (type === 'link' && url) {
    // Open external link directly
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    // For file materials, get download URL and open in new tab
    try {
      const data = await getMaterialDownloadUrl(id);
      if (data.download_url) {
        window.open(data.download_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error viewing material:', error);
      throw error;
    }
  }
};

/**
 * Download a material file directly using stream endpoint
 * @param {number} id - Material ID
 * @param {string} fileName - Name for the downloaded file
 */
export const downloadMaterial = async (id, fileName) => {
  try {
    // Use stream endpoint for direct download
    const response = await apiClient.get(`/materials/${id}/stream`, {
      responseType: 'blob',
    });

    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let downloadFileName = fileName;

    if (!downloadFileName && contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        downloadFileName = fileNameMatch[1].replace(/['"]/g, '');
      }
    }

    // response.data is already a Blob when responseType is 'blob'
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName || 'download';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup after a slight delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading material:', error);
    throw error;
  }
};
