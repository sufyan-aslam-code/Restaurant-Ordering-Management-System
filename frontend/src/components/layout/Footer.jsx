import Container from "../common/Container";

const footerLinks = [
  "Home",
  "Menu",
  "About",
  "Contact",
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">

      <Container>

        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + Description */}
          <div>

            <h2 className="text-3xl font-bold text-orange-500">
              FoodieHub
            </h2>

            <p className="text-gray-600 mt-3 max-w-md">
              Delicious food delivered fast with a modern
              online ordering experience.
            </p>

          </div>

          {/* Footer Links */}
          <ul className="flex items-center gap-6 flex-wrap">

            {footerLinks.map((link) => (
              <li
                key={link}
                className="text-gray-700 hover:text-orange-500 transition cursor-pointer"
              >
                {link}
              </li>
            ))}

          </ul>

        </div>

      </Container>

    </footer>
  );
};

export default Footer;