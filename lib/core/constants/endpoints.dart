class Endpoints {
  static const String baseUrl =
      "https://college-system-backend.onrender.com/api/v1";

  // Socket.IO origin for realtime notifications.
  // The server runs Socket.IO on the default namespace ("/"). JWT is passed
  // via the auth map (setAuth({'token': jwt})) — NOT as a query param.
  // Events received from server:
  //   - "new-notification" → NotificationModel JSON
  //   - "unread-count"     → int or { count|unreadCount: int }
  static const String notificationsSocketIO =
      "https://college-system-backend.onrender.com";

  static const String login = "/auth/login";
  static const String logout = "/auth/logout";
  static const String refreshToken = "/auth/refresh";

  static const String profile = "/student/profile";
  static const String editProfile = "/student/profile";
  static const String changePassword = "/settings/password";

  static const String schedule = "/schedule";

  static const String studentCourses = "/courses/student";
  static String courseGrades(String courseId) => "/courses/$courseId/grades";

  static const String availableOfferings = "/registration/available-offerings";
  static const String registerCourse = "/registration/register";
  static const String registerLab = "/registration/register-lab";
  static const String dropCourse = "/registration/unregister";

  static const String leaderBoard = "/leaderboard";

  static const String examsSchedule = "/exams/schedule";

  static const String community = "/community/feed";
  static String communityPostLike(String postId) =>
      "/community/posts/$postId/like";
  static String communityPostComment(String postId) =>
      "/community/posts/$postId/comment";
  static const String communitySuggestedGroups = "/community/groups/suggested";
  static const String communityMyGroups = "/community/groups/my";
  static String communityJoinGroup(String groupId) =>
      "/community/groups/$groupId/join";

  static const String attendanceActiveSession =
      "/attendance/sessions/my-active";
  static const String scanAttendance = "/attendance/scan";
  static const String attendanceHistory = "/attendance/my-history";

  static const String materials = "/materials";
  static String downloadMaterial(int materialId) =>
      "/materials/$materialId/download";

  static const String getInvoices = '/payments/invoices/me';
  static const String createPaymobPayment = '/payments/invoices/paymob-order';

  static const String faq = '/faq';

  static const String notification = "/notifications";
  static const String registerDevice = "/notifications/register-device";
  static const String notificationUnreadCount = "/notifications/unread-count";
  static const String notificationMarkAllRead = "/notifications/mark-all-read";

  static String notificationRead(int id) => "/notifications/$id/read";
  static String deleteNotification(int id) => "/notifications/$id";

  static const String tasks = "/tasks";
  static String taskById(int taskId) => "/tasks/$taskId";
  static String submitTask(int taskId) => "/tasks/$taskId/submit";
  static String myTaskSubmission(int taskId) => "/tasks/$taskId/my-submission";
  static const String myAvailableTasks = "/tasks/my/available";
  static const String digitalIdFront = "/student/digital-id/front";
  static const String digitalIdBack = "/student/digital-id/back";
}
