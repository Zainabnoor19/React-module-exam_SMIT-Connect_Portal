import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="p-8 grid md:grid-cols-2 gap-6">
        <Card title="Welcome" desc="Tailwind + React Boilerplate Ready" />

        <Button text="Click Me" />
      </div>

      <Footer />
    </>
  );
};

export default Home;