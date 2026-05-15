import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

const categories = [
  "Pizza",
  "Burgers",
  "Drinks",
  "Desserts",
  "Fast Food",
  "Sandwiches",
];

const Categories = () => {
  return (
    <section className="py-16">

      <Container>

        <SectionHeading
          title="Popular Categories"
          subtitle="Explore your favorite food categories"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">

          {categories.map((category) => (
            <div
              key={category}
              className="bg-white shadow-sm hover:shadow-lg transition rounded-2xl p-6 text-center cursor-pointer border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800">
                {category}
              </h3>
            </div>
          ))}

        </div>

      </Container>

    </section>
  );
};

export default Categories;