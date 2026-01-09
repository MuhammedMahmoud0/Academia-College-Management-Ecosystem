import 'package:college_project/features/leaderboard/models/leaderboard_model.dart';
import 'package:flutter/material.dart';

class StudentRow extends StatelessWidget {
  final Student student;

  const StudentRow({Key? key, required this.student}) : super(key: key);

  Color _getAvatarColor(String avatar) {
    final colors = [
      const Color(0xFFE1D5F7),
      const Color(0xFFD4E4F7),
      const Color(0xFFFFE4E1),
      const Color(0xFFE1F7E5),
      const Color(0xFFFFF4E1),
    ];
    return colors[avatar.codeUnitAt(0) % colors.length];
  }

  Widget _getRankIcon(int rank) {
    if (rank == 1) {
      return const Icon(Icons.emoji_events, color: Color(0xFFFFB020), size: 20);
    } else if (rank == 2) {
      return const Icon(Icons.emoji_events, color: Color(0xFFC0C0C0), size: 20);
    } else if (rank == 3) {
      return const Icon(Icons.emoji_events, color: Color(0xFFCD7F32), size: 20);
    }
    return const SizedBox.shrink();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade200, width: 1),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 50,
            child: Row(
              children: [
                _getRankIcon(student.rank),
                const SizedBox(width: 4),
                Text(
                  '${student.rank}',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 3,
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: _getAvatarColor(student.avatar),
                  child: Text(
                    student.avatar,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.deepPurple.shade700,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    student.name,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: Colors.black87,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              student.id,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
          ),
          SizedBox(
            width: 60,
            child: Text(
              '${student.year}',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
            ),
          ),
          SizedBox(
            width: 80,
            child: Text(
              student.gpa.toStringAsFixed(2),
              textAlign: TextAlign.right,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
