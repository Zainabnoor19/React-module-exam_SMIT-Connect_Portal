const Card = ({ title, desc }) => {
  return (
    <div className="p-6 rounded-2xl shadow-lg border hover:shadow-xl transition">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default Card;