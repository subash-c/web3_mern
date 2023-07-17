import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CategoryCardComponent = ({ category, idx }) => {
  const getLowSize = (s) => {
    return s.substring(0, 200) + "...";
  };
  return (
    <Card>
      <Card.Img
        style={{ height: "50%" }}
        crossOrigin="anonymous"
        variant="top"
        src={category.image ?? null}
      />
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <Card.Text>{getLowSize(category.description)}</Card.Text>
        <LinkContainer to={`/product-list/category/${category.name}`}>
          <Button variant="primary">Go to the Category</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default CategoryCardComponent;
