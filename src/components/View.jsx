import Button from "react-bootstrap/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";

export default function View({ handleModify }) {
  const [content, setContent] = useState({
    writer: "",
    title: "",
    content: "",
    date: "",
  });
  const [isError, setIsError] = useState(false);
  const { id } = useParams();

  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/view?id=${id}`)

      .then(response => {
        console.log(response.data); //[{..}]
        //setContent(response.data);

        // data가 없거나 data의 배열의 개수가 0가 같다면
        if (!response.data || response.data.length === 0) {
          setIsError(true);

          return;
        }

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

  if (isError) {
    return (
      <div>
        <p>잘못된 접근입니다.</p>

        <p>다시확인해주세요</p>

        <Link to="/" className="btn btn-primary">
          홈으로 이동
        </Link>
      </div>
    );
  }

  const handleClick = () => {
    handleModify(id);
  };
  const handleDelete = () => {
    if (window.confirm("정말 삭제할까요")) {
      axios
        .post("http://localhost:3000/delete", {
          id: id,
        })

        .then(() => {
          navigate("/");
        })

        .catch(error => {
          console.error(error);
        })

        .finally(() => {});
    }
  };

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

        <Button variant="secondary" onClick={handleClick}>
          수정
        </Button>

        <Button variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </>
  );
}
