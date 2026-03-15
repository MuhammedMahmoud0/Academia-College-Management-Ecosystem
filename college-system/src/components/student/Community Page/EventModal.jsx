import { useEffect, useState } from 'react';

export default function EventModal({
	isOpen,
	onClose,
	onSubmit,
	mode = 'create',
	initialValues = null,
	isSubmitting = false,
	submitError = ''
}) {
	const [formData, setFormData] = useState({
		title: '',
		event_date: '',
		time: '',
		location: '',
		img_url: '',
		link: '',
		description: ''
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setFormData({
			title: initialValues?.title || '',
			event_date: initialValues?.event_date || initialValues?.date || '',
			time: initialValues?.time || '',
			location: initialValues?.location || '',
			img_url: initialValues?.img_url || initialValues?.image || '',
			link: initialValues?.link || '',
			description: initialValues?.description || ''
		});
	}, [isOpen, initialValues]);

	if (!isOpen) {
		return null;
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleClose = () => {
		if (!isSubmitting) {
			onClose();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			title: formData.title.trim(),
			event_date: formData.event_date,
			time: formData.time,
			location: formData.location.trim(),
		};

		const optionalFields = ['img_url', 'link', 'description'];
		optionalFields.forEach((field) => {
			const value = formData[field].trim();
			if (value) {
				payload[field] = value;
			}
		});

		await onSubmit(payload);
	};

	const isEditMode = mode === 'edit';
	const title = isEditMode ? 'Edit Event' : 'Create Event';
	const subtitle = isEditMode ? 'Update event details.' : 'Add a new campus activity.';
	const submitLabel = isEditMode
		? (isSubmitting ? 'Saving...' : 'Save Changes')
		: (isSubmitting ? 'Creating...' : 'Create Event');

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={handleClose}>
			<div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
								aria-label="Close create event modal"
							>
								<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label htmlFor="event-title" className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
								<input
									id="event-title"
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									required
									maxLength={150}
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label htmlFor="event-date" className="mb-1 block text-sm font-medium text-gray-700">Date *</label>
								<input
									id="event-date"
									type="date"
									name="event_date"
									value={formData.event_date}
									onChange={handleChange}
									required
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div>
								<label htmlFor="event-time" className="mb-1 block text-sm font-medium text-gray-700">Time *</label>
								<input
									id="event-time"
									type="time"
									name="time"
									value={formData.time}
									onChange={handleChange}
									required
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div className="sm:col-span-2">
								<label htmlFor="event-location" className="mb-1 block text-sm font-medium text-gray-700">Location *</label>
								<input
									id="event-location"
									type="text"
									name="location"
									value={formData.location}
									onChange={handleChange}
									required
									maxLength={200}
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div className="sm:col-span-2">
								<label htmlFor="event-image" className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
								<input
									id="event-image"
									type="url"
									name="img_url"
									value={formData.img_url}
									onChange={handleChange}
									placeholder="https://example.com/event.jpg"
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div className="sm:col-span-2">
								<label htmlFor="event-link" className="mb-1 block text-sm font-medium text-gray-700">Registration Link</label>
								<input
									id="event-link"
									type="url"
									name="link"
									value={formData.link}
									onChange={handleChange}
									placeholder="https://example.com/register"
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>

							<div className="sm:col-span-2">
								<label htmlFor="event-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
								<textarea
									id="event-description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									rows={3}
									maxLength={1000}
									className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500"
								/>
							</div>
						</div>

						{submitError ? (
							<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{submitError}
							</div>
						) : null}
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
