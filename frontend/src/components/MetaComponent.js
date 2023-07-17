import { Helmet, HelmetProvider } from "react-helmet-async";

const MetaComponent = ({
  title = "C.S 🛍",
  description = "Best Online Shop in India and Top in all over the world",
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaComponent;
