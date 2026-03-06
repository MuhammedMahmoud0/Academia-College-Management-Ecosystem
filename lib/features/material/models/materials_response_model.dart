class MaterialsResponseModel {
  final List<MaterialModel> data;

  MaterialsResponseModel({required this.data});

  factory MaterialsResponseModel.fromJson(List<dynamic> json) {
    return MaterialsResponseModel(
      data: json.map((item) => MaterialModel.fromJson(item)).toList(),
    );
  }

  /// Group materials by lecture_id
  Map<int, List<MaterialModel>> get groupedByLecture {
    final Map<int, List<MaterialModel>> grouped = {};
    for (final material in data) {
      final lectureId = material.lectureId ?? 0;
      if (!grouped.containsKey(lectureId)) {
        grouped[lectureId] = [];
      }
      grouped[lectureId]!.add(material);
    }
    return grouped;
  }

  /// Get all PDF materials (files)
  List<MaterialModel> get fileMaterials {
    return data.where((m) => m.isFile).toList();
  }

  /// Get all link materials
  List<MaterialModel> get linkMaterials {
    return data.where((m) => m.isLink).toList();
  }
}

class MaterialModel {
  final int id;
  final int? lectureId;
  final int? tutorialLabId;
  final String title;
  final String? url;
  final String? fileId;
  final DateTime uploadedAt;
  final FileModel? files;

  MaterialModel({
    required this.id,
    this.lectureId,
    this.tutorialLabId,
    required this.title,
    this.url,
    this.fileId,
    required this.uploadedAt,
    this.files,
  });

  factory MaterialModel.fromJson(Map<String, dynamic> json) {
    return MaterialModel(
      id: json['id'] as int,
      lectureId: json['lecture_id'] as int?,
      tutorialLabId: json['tutorial_lab_id'] as int?,
      title: json['title'] as String,
      url: json['url'] as String?,
      fileId: json['file_id'] as String?,
      uploadedAt: DateTime.parse(json['uploaded_at'] as String),
      files: json['files'] != null
          ? FileModel.fromJson(json['files'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'lecture_id': lectureId,
      'tutorial_lab_id': tutorialLabId,
      'title': title,
      'url': url,
      'file_id': fileId,
      'uploaded_at': uploadedAt.toIso8601String(),
      'files': files?.toJson(),
    };
  }

  /// Check if this material is a file (PDF)
  bool get isFile => files != null && url == null;

  /// Check if this material is a link
  bool get isLink => url != null;

  /// Get the display size for files
  String get displaySize {
    if (files == null) return '';
    final bytes = int.tryParse(files!.sizeBytes) ?? 0;
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  /// Get formatted upload date
  String get formattedDate {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[uploadedAt.month - 1]} ${uploadedAt.day.toString().padLeft(2, '0')}, ${uploadedAt.year}';
  }

  /// Get the URL to display or use
  String get displayUrl => url ?? '';

  /// Get file download path
  String? get filePath => files?.filePath;
}

class FileModel {
  final String fileId;
  final String fileName;
  final String filePath;
  final String mediaType;
  final String sizeBytes;
  final String uploadedByUserId;
  final DateTime createdAt;

  FileModel({
    required this.fileId,
    required this.fileName,
    required this.filePath,
    required this.mediaType,
    required this.sizeBytes,
    required this.uploadedByUserId,
    required this.createdAt,
  });

  factory FileModel.fromJson(Map<String, dynamic> json) {
    return FileModel(
      fileId: json['file_id'] as String,
      fileName: json['file_name'] as String,
      filePath: json['file_path'] as String,
      mediaType: json['media_type'] as String,
      sizeBytes: json['size_bytes'] as String,
      uploadedByUserId: json['uploaded_by_user_id'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'file_id': fileId,
      'file_name': fileName,
      'file_path': filePath,
      'media_type': mediaType,
      'size_bytes': sizeBytes,
      'uploaded_by_user_id': uploadedByUserId,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
