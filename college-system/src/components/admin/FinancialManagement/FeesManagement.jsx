import { useState } from 'react';
import AddFeeModal from './AddFeeModal';
import EditFeeModal from './EditFeeModal';
import EditTuitionModal from './EditTuitionModal';

export default function FeesManagement() {
    const [tuitionRates, setTuitionRates] = useState([
        { id: 1, program: 'B.Sc. in Computer Science', fee: '$5,000' },
        { id: 2, program: 'B.Sc. in Mechanical Eng.', fee: '$5,500' },
        { id: 3, program: 'BBA', fee: '$4,500' }
    ]);

    const [campusFees, setCampusFees] = useState([
        { id: 1, name: 'Library Fee', amount: '$50', type: 'Per Semester' },
        { id: 2, name: 'Lab Fee', amount: '$150', type: 'Per Course' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [isEditTuitionModalOpen, setIsEditTuitionModalOpen] = useState(false);
    const [editingTuition, setEditingTuition] = useState(null);

    const handleEditTuition = (item) => {
        setEditingTuition(item);
        setIsEditTuitionModalOpen(true);
    };

    const handleEditTuitionModalClose = () => {
        setIsEditTuitionModalOpen(false);
        setEditingTuition(null);
    };

    const handleEditTuitionModalSubmit = (formData) => {
        const updatedTuition = tuitionRates.map(tuition => 
            tuition.id === editingTuition.id 
                ? { ...tuition, program: formData.program, fee: `$${Number(formData.fee).toLocaleString()}` }
                : tuition
        );
        setTuitionRates(updatedTuition);
        setIsEditTuitionModalOpen(false);
        setEditingTuition(null);
    };

    const handleEditFee = (item) => {
        setEditingFee(item);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setEditingFee(null);
    };

    const handleEditModalSubmit = (formData) => {
        const updatedFees = campusFees.map(fee => 
            fee.id === editingFee.id 
                ? { ...fee, name: formData.feeName, amount: `$${formData.amount}`, type: formData.type }
                : fee
        );
        setCampusFees(updatedFees);
        setIsEditModalOpen(false);
        setEditingFee(null);
    };

    const handleDeleteFee = (id) => {
        console.log('Delete fee:', id);
        setCampusFees(campusFees.filter(fee => fee.id !== id));
    };

    const handleAddFee = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = (formData) => {
        const newFee = {
            id: campusFees.length + 1,
            name: formData.feeName,
            amount: `$${formData.amount}`,
            type: formData.type
        };
        setCampusFees([...campusFees, newFee]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Tuition Rates per Semester */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 md:mb-8 overflow-hidden">
                <div className="p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Tuition Rates per Semester</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Program</th>
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Tuition Fee</th>
                                    <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tuitionRates.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2 md:px-4 text-sm md:text-base text-gray-900">{item.program}</td>
                                        <td className="py-4 px-2 md:px-4 text-sm md:text-base text-gray-900">{item.fee}</td>
                                        <td className="py-4 px-2 md:px-4 text-right">
                                            <button
                                                onClick={() => handleEditTuition(item)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Other Campus Fees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Other Campus Fees</h2>
                        <button
                            onClick={handleAddFee}
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Fee
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Fee Name</th>
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Type</th>
                                    <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campusFees.map((fee) => (
                                    <tr key={fee.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2 md:px-4 text-sm md:text-base text-gray-900">{fee.name}</td>
                                        <td className="py-4 px-2 md:px-4 text-sm md:text-base text-gray-900">{fee.amount}</td>
                                        <td className="py-4 px-2 md:px-4 text-sm md:text-base text-gray-600">{fee.type}</td>
                                        <td className="py-4 px-2 md:px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditFee(fee)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFee(fee.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Fee Modal */}
            <AddFeeModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />

            {/* Edit Fee Modal */}
            <EditFeeModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSubmit={handleEditModalSubmit}
                fee={editingFee}
            />

            {/* Edit Tuition Modal */}
            <EditTuitionModal
                isOpen={isEditTuitionModalOpen}
                onClose={handleEditTuitionModalClose}
                onSubmit={handleEditTuitionModalSubmit}
                tuition={editingTuition}
            />
        </div>
    );
}