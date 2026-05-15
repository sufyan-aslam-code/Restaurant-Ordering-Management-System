const SectionHeading = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="text-4xl font-bold text-gray-900">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;