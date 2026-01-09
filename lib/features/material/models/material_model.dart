enum StudyMaterialType { pdf, link }

class StudyMaterial {
  final String title;
  final String description;
  final String date;
  final StudyMaterialType type;
  final String sizeOrUrl;

  StudyMaterial({
    required this.title,
    required this.description,
    required this.date,
    required this.type,
    required this.sizeOrUrl,
  });
}

class MaterialData {
  static List<StudyMaterial> getSampleMaterials() {
    return [
      StudyMaterial(
        title: 'Introduction to Algorithms',
        description: 'Comprehensive guide to sorting and searching.',
        date: 'Oct 12, 2023',
        type: StudyMaterialType.pdf,
        sizeOrUrl: '2.4 MB',
      ),
      StudyMaterial(
        title: 'Advanced Flutter UI Patterns',
        description: 'External link to the official documentation.',
        date: 'Nov 05, 2023',
        type: StudyMaterialType.link,
        sizeOrUrl: 'flutter.dev/docs',
      ),
      StudyMaterial(
        title: 'Discrete Mathematics Notes',
        description: 'Lecture notes covering graph theory.',
        date: 'Sep 20, 2023',
        type: StudyMaterialType.pdf,
        sizeOrUrl: '1.8 MB',
      ),
      StudyMaterial(
        title: 'Database Systems Video',
        description: 'Video lecture playlist on SQL optimization.',
        date: 'Dec 01, 2023',
        type: StudyMaterialType.link,
        sizeOrUrl: 'youtube.com/playlist',
      ),
    ];
  }
}
