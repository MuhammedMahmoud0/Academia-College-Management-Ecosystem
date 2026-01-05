class Course {
  final String title;
  final String code;
  final String credits;
  final String instructor;
  final String seats;
  final String time;

  Course({
    required this.title,
    required this.code,
    required this.credits,
    required this.instructor,
    required this.seats,
    required this.time,
  });

  bool get isFull => seats.toLowerCase() == 'full';
}
