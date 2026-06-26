const StarRating = ({ value = 0, onChange = null, size = 'md' }) => {
  const interactive = typeof onChange === 'function';
  const sizes = { sm: '0.85rem', md: '1.1rem', lg: '1.6rem' };
  return (
    <div className="star-rating" style={{ fontSize: sizes[size] }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star${star <= value ? ' filled' : ''}${interactive ? ' interactive' : ''}`}
          onClick={() => interactive && onChange(star)}
        >★</span>
      ))}
    </div>
  );
};
export default StarRating;
