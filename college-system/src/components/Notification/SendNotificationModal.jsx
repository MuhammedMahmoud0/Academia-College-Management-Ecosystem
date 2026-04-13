import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

const NOTIFICATION_TYPES = [
	{ value: 'new_grade', label: 'New Grade' },
	{ value: 'exam_deadline', label: 'Exam Deadline' },
	{ value: 'community_activity', label: 'Community Activity' },
	{ value: 'campus_announcement', label: 'Campus Announcement' },
];

const getUserLabel = (user) => {
	return user?.full_name || user?.name || `User #${user?.id}`;
};

export default function SendNotificationModal({
	isOpen,
	onClose,
	onSubmit,
	users = [],
	loadingUsers = false,
	isSubmitting = false,
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [message, setMessage] = useState('');
	const [type, setType] = useState('new_grade');
	const [selectedUserIds, setSelectedUserIds] = useState([]);

	useEffect(() => {
		if (!isOpen) return;
		setSearchQuery('');
		setMessage('');
		setType('new_grade');
		setSelectedUserIds([]);
	}, [isOpen]);

	const filteredUsers = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();
		if (!normalizedQuery) return users;

		return users.filter((user) => {
			const idValue = String(user?.id || '').toLowerCase();
			const fullName = String(user?.full_name || user?.name || '').toLowerCase();
			return idValue.includes(normalizedQuery) || fullName.includes(normalizedQuery);
		});
	}, [users, searchQuery]);

	const selectedCount = selectedUserIds.length;
	const endpointHint = selectedCount <= 1 ? 'POST /notifications' : 'POST /notifications/bulk';

	const toggleUserSelection = (userId) => {
		setSelectedUserIds((prev) => {
			if (prev.includes(userId)) {
				return prev.filter((id) => id !== userId);
			}
			return [...prev, userId];
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const trimmedMessage = message.trim();
		if (!trimmedMessage || selectedUserIds.length === 0) return;

		await onSubmit({
			userIds: selectedUserIds,
			message: trimmedMessage,
			type,
		});
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-hidden">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close"
				>
					<X size={20} />
				</button>

				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="px-6 pt-6 pb-4 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Send Notification</h2>
						<p className="mt-1 text-sm text-gray-500">
							Select one user for single send or multiple users for bulk send.
						</p>
					</div>

					<div className="p-6 space-y-5 overflow-y-auto">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Message
							</label>
							<textarea
								value={message}
								onChange={(event) => setMessage(event.target.value)}
								rows={4}
								placeholder="Write notification message"
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Type
							</label>
							<select
								value={type}
								onChange={(event) => setType(event.target.value)}
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							>
								{NOTIFICATION_TYPES.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Select Users
							</label>
							<div className="relative mb-3">
								<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Search by name or id"
									className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							<div className="rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
								{loadingUsers ? (
									<div className="p-4 text-sm text-gray-500">Loading users...</div>
								) : filteredUsers.length === 0 ? (
									<div className="p-4 text-sm text-gray-500">No users match your search.</div>
								) : (
									filteredUsers.map((user) => {
										const userId = user?.id;
										if (!userId) return null;

										return (
											<label
												key={userId}
												className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={selectedUserIds.includes(userId)}
													onChange={() => toggleUserSelection(userId)}
													className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
												/>
												<div className="min-w-0">
													<p className="text-sm font-medium text-gray-800 truncate">{getUserLabel(user)}</p>
													<p className="text-xs text-gray-500">ID: {userId}</p>
												</div>
											</label>
										);
									})
								)}
							</div>
						</div>
					</div>

					<div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="text-sm text-gray-600">
							<span className="font-medium">Selected:</span> {selectedCount} user{selectedCount === 1 ? '' : 's'}
							<span className="mx-2">|</span>
							<span className="font-medium">Endpoint:</span> {endpointHint}
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={onClose}
								disabled={isSubmitting}
								className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting || loadingUsers || selectedCount === 0 || !message.trim()}
								className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
							>
								{isSubmitting ? 'Sending...' : 'Send Notification'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}