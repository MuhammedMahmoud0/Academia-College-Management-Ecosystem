import { useEffect, useState } from 'react';

export default function GroupModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialValues = null,
  isSubmitting = false,
  submitError = ''
}) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		avatar_url: ''
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setFormData({
			name: initialValues?.name || '',
			description: initialValues?.description || '',
			avatar_url: initialValues?.avatar_url || ''
		});
	}, [isOpen, initialValues]);

	if (!isOpen) {
		return null;
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			name: formData.name.trim(),
			description: formData.description.trim(),
		};

		const avatarUrl = formData.avatar_url.trim();
		if (avatarUrl) {
			payload.avatar_url = avatarUrl;
		}

		await onSubmit(payload);
	};

	const isEditMode = mode === 'edit';
	const title = isEditMode ? 'Edit Group' : 'Create Group';
	const subtitle = isEditMode
		? 'Update the group details.'
		: 'Start a new community for students.';
	const submitLabel = isEditMode
		? (isSubmitting ? 'Saving...' : 'Save Changes')
		: (isSubmitting ? 'Creating...' : 'Create Group');

	const handleClose = () => {
		if (!isSubmitting) {
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={handleClose}>
			<div className="w-full max-w-xl rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
				<form onSubmit={handleSubmit}>
					<div className="p-6">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
								<p className="mt-1 text-sm text-gray-500">{subtitle}</p>
							</div>
							<button
								type="button"
								onClick={handleClose}
								disabled={isSubmitting}
								className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Close create group modal"
							>
								<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label htmlFor="group-name" className="mb-1 block text-sm font-medium text-gray-700">
									Group Name *
								</label>
								<input
									id="group-name"
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									maxLength={120}
									placeholder="e.g. Computer Science Club"
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label htmlFor="group-description" className="mb-1 block text-sm font-medium text-gray-700">
									Description *
								</label>
								<textarea
									id="group-description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									required
									rows={4}
									maxLength={800}
									placeholder="What is this group about?"
									className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label htmlFor="group-avatar" className="mb-1 block text-sm font-medium text-gray-700">
									Avatar URL (optional)
								</label>
								<input
									id="group-avatar"
									type="url"
									name="avatar_url"
									value={formData.avatar_url}
									onChange={handleChange}
									placeholder="https://example.com/group-avatar.jpg"
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							{submitError ? (
								<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
									{submitError}
								</div>
							) : null}
						</div>
					</div>

					<div className="flex gap-3 rounded-b-xl bg-gray-50 px-6 py-4">
						<button
							type="button"
							onClick={handleClose}
							disabled={isSubmitting}
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
