import './ProductCard.css';

function ProductCard({ product, onDelete, onEdit, onStockChange }) {
  let stockStatus;

  if (product.stock === 0) {
    stockStatus = "Out of Stock";
  } else if (product.stock <= 5) {
    stockStatus = "Low Stock";
  } else {
    stockStatus = "In Stock";
  }

  return (
    <div className="product-card">

      <h3>{product.name}</h3>

      <p>Category: {product.category}</p>

<div className="stock-controls">

  <p>Stock: {product.stock}</p>

  <div className="stock-buttons">
    <button
      onClick={() => onStockChange(product.id, -1)}
      disabled={product.stock === 0}
    >
      -
    </button>

    <button onClick={() => onStockChange(product.id, 1)}>
      +
    </button>
  </div>

</div>

      <p className={`stock-status ${stockStatus.toLowerCase().replaceAll(" ", "-")}`}>
  Status: {stockStatus}
</p>

      <button
  className="edit-button"
  onClick={() => onEdit(product)}
>
  Edit
</button>

      <button
  className="delete-button"
  onClick={() => onDelete(product.id)}
>
  Delete
</button>

    </div>
  );
}

export default ProductCard;