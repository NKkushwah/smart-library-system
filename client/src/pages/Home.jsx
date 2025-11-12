import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/Footer";

export const Home = () => {
  return (
    <>
      <main>
        <section className="hero-section d-flex align-items-center">
          <div className="container">
            <div className="row align-items-center">
              {/* Left Content */}
              <div className="col-md-6 hero-content">
                <p className="text-uppercase text-primary fw-bold mb-2">
                  We are the World's Best IT Company
                </p>
                <h1 className="display-4 fw-bold mb-3">
                  Welcome to <span className="text-gradient">My Library</span>
                </h1>
                <p className="lead text-muted mb-4">
                  Are you ready to take your business to the next level with
                  cutting-edge IT solutions? Look no further! At{" "}
                  <strong>Nandu Technical</strong>, we specialize in providing
                  innovative IT services and solutions tailored to meet your
                  unique needs.
                </p>
                <div className="d-flex gap-3">
                  <a href="/contact" className="btn btn-primary btn-lg shadow">
                    <i className="bi bi-telephone-fill me-2"></i> Connect Now
                  </a>
                  <a href="/service" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-info-circle-fill me-2"></i> Learn More
                  </a>
                </div>
              </div>

              {/* Right Image */}
              <div className="col-md-6 text-center hero-image">
                <img
                  src="/Images/registeration.jpg"
                  alt="coding together"
                  className="img-fluid rounded-4 shadow-lg hero-img"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
