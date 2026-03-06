class DownloadMaterialModel {
  String? downloadUrl;
  String? error;

  DownloadMaterialModel({this.downloadUrl, this.error});

  DownloadMaterialModel.fromJson(Map<String, dynamic> json) {
    downloadUrl = json['download_url'];
    error = json['error'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    data['download_url'] = downloadUrl;
    data['error'] = error;
    return data;
  }
}
