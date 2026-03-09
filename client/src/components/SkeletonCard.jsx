const SkeletonCard = () => {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] animate-pulse w-full h-full flex flex-col">
            <div className="aspect-[2/3] w-full bg-gray-800"></div>
            <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
