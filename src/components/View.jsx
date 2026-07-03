import Button from "react-bootstrap/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function View() {
  const [content, setContent] = useState({
    writer: "",
    title: "",
    content: "",
    date: "",
  });
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/view?id=${id}`)
      .then(response => {
        console.log(response.data); //[{..}]
        //setContent(response.data);

        const data = response.data[0];

        setContent({
          writer: data.writer,
          title: data.title,
          content: data.content,
          date: data.date,
        });
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        console.log("요청완료");
      });
  }, []);

  return (
    <>
      <h2>{content.title}</h2>

      <div className="d-flex justify-content-between">
        <p>글쓴이: {content.writer}</p>

        <p>{content.date}</p>
      </div>
      <hr />
      {content.content}
      <hr />
      <div className="d-flex gap-1 justify-content-end">
        <Link to="/" className="btn btn-primary">
          홈
        </Link>

        <Button variant="secondary">수정</Button>

        <Button variant="danger">삭제</Button>
      </div>
    </>
  );
}
