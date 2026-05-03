class InvoicesResponseModel {
  final List<InvoiceModel> invoices;
  final List<GroupedInvoiceModel> groupedInvoices;
  final InvoicesSummary summary;
  final BillingPeriod paymentPeriod;

  InvoicesResponseModel({
    required this.invoices,
    required this.groupedInvoices,
    required this.summary,
    required this.paymentPeriod,
  });

  factory InvoicesResponseModel.fromJson(Map<String, dynamic> json) {
    return InvoicesResponseModel(
      invoices: (json['invoices'] as List? ?? [])
          .map((e) => InvoiceModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      groupedInvoices: (json['groupedInvoices'] as List? ?? [])
          .map((e) => GroupedInvoiceModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      summary: InvoicesSummary.fromJson(
        (json['summary'] as Map<String, dynamic>?) ?? const {},
      ),

      paymentPeriod: BillingPeriod.fromJson(
        (json['paymentPeriod'] as Map<String, dynamic>?) ?? const {},
      ),
    );
  }
}

class InvoiceModel {
  final int id;
  final String studentUserId;
  final int enrollmentId;
  final String courseCode;
  final String semester;
  final int year;
  final int creditHours;
  final num creditPrice;
  final num totalAmount;
  final String status;
  final String? paypalOrderId;
  final DateTime? paymentDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final List<dynamic> payments;

  InvoiceModel({
    required this.id,
    required this.studentUserId,
    required this.enrollmentId,
    required this.courseCode,
    required this.semester,
    required this.year,
    required this.creditHours,
    required this.creditPrice,
    required this.totalAmount,
    required this.status,
    this.paypalOrderId,
    this.paymentDate,
    this.createdAt,
    this.updatedAt,
    required this.payments,
  });

  bool get isPaid => status.toLowerCase() == 'paid';
  bool get isPending => status.toLowerCase() == 'pending';

  factory InvoiceModel.fromJson(Map<String, dynamic> json) {
    return InvoiceModel(
      id: json['id'] as int? ?? 0,
      studentUserId: json['student_user_id']?.toString() ?? '',
      enrollmentId: json['enrollment_id'] as int? ?? 0,
      courseCode: json['course_code']?.toString() ?? '',
      semester: json['semester']?.toString() ?? '',
      year: json['year'] as int? ?? 0,
      creditHours: json['credit_hours'] as int? ?? 0,
      creditPrice: (json['credit_price'] as num?) ?? 0,
      totalAmount: (json['total_amount'] as num?) ?? 0,
      status: json['status']?.toString() ?? 'pending',
      paypalOrderId: json['paypal_order_id']?.toString(),
      paymentDate: _parseDate(json['payment_date']),
      createdAt: _parseDate(json['created_at']),
      updatedAt: _parseDate(json['updated_at']),
      payments: (json['payments'] as List?) ?? const [],
    );
  }

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    return DateTime.tryParse(value.toString());
  }
}

class GroupedInvoiceModel {
  final String semester;
  final int year;
  final List<InvoiceModel> invoices;
  final InvoicesSummary summary;

  GroupedInvoiceModel({
    required this.semester,
    required this.year,
    required this.invoices,
    required this.summary,
  });

  String get title => '$semester $year';

  factory GroupedInvoiceModel.fromJson(Map<String, dynamic> json) {
    return GroupedInvoiceModel(
      semester: json['semester']?.toString() ?? '',
      year: json['year'] as int? ?? 0,
      invoices: (json['invoices'] as List? ?? [])
          .map((e) => InvoiceModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      summary: InvoicesSummary.fromJson(
        (json['summary'] as Map<String, dynamic>?) ?? const {},
      ),
    );
  }
}

class InvoicesSummary {
  final int totalInvoices;
  final int pendingInvoices;
  final num totalDue;

  InvoicesSummary({
    required this.totalInvoices,
    required this.pendingInvoices,
    required this.totalDue,
  });

  factory InvoicesSummary.fromJson(Map<String, dynamic> json) {
    return InvoicesSummary(
      totalInvoices: json['totalInvoices'] as int? ?? 0,
      pendingInvoices: json['pendingInvoices'] as int? ?? 0,
      totalDue: (json['totalDue'] as num?) ?? 0,
    );
  }
}

class BillingPeriod {
  final bool isOpen;
  final String? semester;
  final int? year;
  final String? startDate;
  final String? endDate;
  final String? nextOpenDate;

  BillingPeriod({
    required this.isOpen,
    this.semester,
    this.year,
    this.startDate,
    this.endDate,
    this.nextOpenDate,
  });

  factory BillingPeriod.fromJson(Map<String, dynamic> json) {
    return BillingPeriod(
      isOpen: json['isOpen'] as bool? ?? false,
      semester: json['semester']?.toString(),
      year: json['year'] as int?,
      startDate: json['startDate']?.toString(),
      endDate: json['endDate']?.toString(),
      nextOpenDate: json['nextOpenDate']?.toString(),
    );
  }
}
