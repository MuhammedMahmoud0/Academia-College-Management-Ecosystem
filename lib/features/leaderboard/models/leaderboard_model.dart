// models/student.dart

class Student {
  final int rank;
  final String name;
  final String id;
  final int year;
  final double gpa;
  final String avatar;

  Student({
    required this.rank,
    required this.name,
    required this.id,
    required this.year,
    required this.gpa,
    required this.avatar,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      rank: json['rank'],
      name: json['name'],
      id: json['id'],
      year: json['year'],
      gpa: json['gpa'],
      avatar: json['avatar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rank': rank,
      'name': name,
      'id': id,
      'year': year,
      'gpa': gpa,
      'avatar': avatar,
    };
  }
}

// Sample data generator
class StudentData {
  static List<Student> getSampleStudents() {
    return [
      Student(
        rank: 1,
        name: 'Student A0',
        id: 'AC-123456',
        year: 1,
        gpa: 4.00,
        avatar: 'A',
      ),
      Student(
        rank: 2,
        name: 'Student B1',
        id: 'AC-123457',
        year: 2,
        gpa: 3.98,
        avatar: 'B',
      ),
      Student(
        rank: 3,
        name: 'Student C2',
        id: 'AC-123458',
        year: 3,
        gpa: 3.97,
        avatar: 'C',
      ),
      Student(
        rank: 4,
        name: 'Student D3',
        id: 'AC-123459',
        year: 4,
        gpa: 3.96,
        avatar: 'D',
      ),
      Student(
        rank: 5,
        name: 'Student E4',
        id: 'AC-123460',
        year: 1,
        gpa: 3.94,
        avatar: 'E',
      ),
      Student(
        rank: 6,
        name: 'Student F5',
        id: 'AC-123461',
        year: 2,
        gpa: 3.92,
        avatar: 'F',
      ),
      Student(
        rank: 7,
        name: 'Student G6',
        id: 'AC-123462',
        year: 3,
        gpa: 3.91,
        avatar: 'G',
      ),
      Student(
        rank: 8,
        name: 'Student H7',
        id: 'AC-123463',
        year: 4,
        gpa: 3.90,
        avatar: 'H',
      ),
      Student(
        rank: 9,
        name: 'Student I8',
        id: 'AC-123464',
        year: 1,
        gpa: 3.88,
        avatar: 'I',
      ),
      Student(
        rank: 10,
        name: 'Student J9',
        id: 'AC-123465',
        year: 2,
        gpa: 3.87,
        avatar: 'J',
      ),
      Student(
        rank: 11,
        name: 'Student K10',
        id: 'AC-123466',
        year: 3,
        gpa: 3.85,
        avatar: 'K',
      ),
      Student(
        rank: 12,
        name: 'Student L11',
        id: 'AC-123467',
        year: 4,
        gpa: 3.83,
        avatar: 'L',
      ),
      Student(
        rank: 13,
        name: 'Student M12',
        id: 'AC-123468',
        year: 1,
        gpa: 3.82,
        avatar: 'M',
      ),
      Student(
        rank: 14,
        name: 'Student N13',
        id: 'AC-123469',
        year: 2,
        gpa: 3.81,
        avatar: 'N',
      ),
      Student(
        rank: 15,
        name: 'Student O14',
        id: 'AC-123470',
        year: 3,
        gpa: 3.79,
        avatar: 'O',
      ),
      Student(
        rank: 16,
        name: 'Student P15',
        id: 'AC-123471',
        year: 4,
        gpa: 3.77,
        avatar: 'P',
      ),
      Student(
        rank: 17,
        name: 'Student Q16',
        id: 'AC-123472',
        year: 1,
        gpa: 3.76,
        avatar: 'Q',
      ),
      Student(
        rank: 18,
        name: 'Student R17',
        id: 'AC-123473',
        year: 2,
        gpa: 3.75,
        avatar: 'R',
      ),
      Student(
        rank: 19,
        name: 'Student S18',
        id: 'AC-123474',
        year: 3,
        gpa: 3.73,
        avatar: 'S',
      ),
      Student(
        rank: 20,
        name: 'Student T19',
        id: 'AC-123475',
        year: 4,
        gpa: 3.71,
        avatar: 'T',
      ),
    ];
  }
}
