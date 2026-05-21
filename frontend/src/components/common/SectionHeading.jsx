const SectionHeading = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;