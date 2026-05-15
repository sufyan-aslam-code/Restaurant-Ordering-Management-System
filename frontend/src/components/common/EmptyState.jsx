const EmptyState = ({
  title = "No Data Found",
  subtitle = "",
}) => {
  return (
    <div className="text-center py-16">
      <h3 className="text-2xl font-bold text-gray-800">
        {title}
      </h3>

      {subtitle && (
        <p className="text-gray-500 mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default EmptyState;