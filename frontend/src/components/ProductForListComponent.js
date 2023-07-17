import axios from "axios";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";
import Flatted from "flatted";

const ProductForListComponent = ({
  productId,
  name,
  description,
  price,
  images,
  rating,
  reviewsNumber,
}) => {
  const getLowSize = (s) => {
    return s.substring(0, 200) + "...";
  };
  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <Row>
        <Col lg={5}>
          <blockquote
            class="imgur-embed-pub"
            lang="en"
            data-id="a/TDwuKEI"
            data-context="false"
          >
            <a href="//imgur.com/a/TDwuKEI"></a>
          </blockquote>
          <script
            async
            src="//s.imgur.com/min/embed.js"
            charset="utf-8"
          ></script>
          <Card.Img
            crossOrigin="anonymous"
            variant="top"
            src={
              // "https://drive.google.com/drive/folders/1ps1ighAqZFBCGJCM79e3bitT35NNQ7o3"
              // "https://firebasestorage.googleapis.com/v0/b/mern-ecom-fdc77.appspot.com/o/1-1-540828-noble-faith-l-original-imae8zbajetnasvt.jpeg?alt=media&token=b429b2ce-3ec9-4090-aab4-164ceb21350f"
              // "http://img6a.flixcart.com/image/shoe/s/g/m/black-r998-22-ladela-38-original-imaeh3w9sc3nhuwa.jpeg"
              "https://raw.githubusercontent.com/subash-c/productImages/main/0000000000000-deziworkz-1100x1100-imaedz2krgqc4pxx.jpeg"
            }
          />
          {/* {console.log(images)} */}
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{getLowSize(description)}</Card.Text>
            <Card.Text>
              <Rating readonly size={20} initialValue={rating} /> (
              {reviewsNumber})
            </Card.Text>
            <Card.Text className="h4">
              ₹{price}{" "}
              <LinkContainer to={`/product-details/${productId}`}>
                <Button variant="danger">See product</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForListComponent;
