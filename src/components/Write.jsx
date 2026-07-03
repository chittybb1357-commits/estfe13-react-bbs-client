import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Write({ isModifyMode, boardId, handleCancel }) {
  let navigate = useNavigate();

  const [content, setContent] = useState({
    name: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    if (isModifyMode && boardId) {
      //boardId로 서버에 글 조회, 조회결과로 content 업데이트
      axios
        .get(`http://localhost:3000/view?id=${boardId}`)
        .then(response => {
          console.log(response.data); //[{..}]
          //setContent(response.data);

          //data가 없거나 data의 배열의 개수가 0가 같다면
          if (!response.data || response.data.length === 0) {
            setIsError(true);

            return;
          }

          const data = response.data[0];

          setContent({
            name: data.writer,
            title: data.title,
            content: data.content,
            date: data.date,
          });
        })
        .catch(error => {
          console.error(error);
          setIsError(true);
        })
        .finally(() => {
          console.log("요청완료");
        });
    }
  }, []);

  const validate = () => {
    const name = e.target.name.value.trim();
    const title = e.target.title.value.trim();
    const content = e.target.content.value.trim();

    if (!name || !title || !content) {
      alert("모든 내용을 작성해주세요");
      return null;
    }

    return {
      name,
      title,
      content,
    };
  };
  const write = e => {
    e.preventDefault();

    const formData = validate(e);

    axios
      .post("http://localhost:3000/write", {
        name: name,
        title: title,
        content: content,
      })
      .then(response => {
        navigate("/");
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {});
  };
  const update = e => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/update", {
        name: e.target.name.value,
        title: e.target.title.value,
        content: e.target.content.value,
        id: boardId,
      })
      .then(() => {
        handleCancel();
        navigate("/");
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {});
  };
  const handleClick = () => {
    handleCancel();
    navigate("/");
  };

  return (
    <>
      <h2 className="mb-3">{isModifyMode ? "글수정" : "글쓰기"}</h2>

      <Form onSubmit={isModifyMode ? update : write}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>글쓴이</Form.Label>

          <Form.Control
            type="text"
            name="name"
            defaultValue={content.name}
            placeholder="이름을 입력해주세요"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>

          <Form.Control
            type="text"
            name="title"
            defaultValue={content.title}
            placeholder="제목을 입력해주세요"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>

          <Form.Control
            as="textarea"
            name="content"
            defaultValue={content.content}
            rows={3}
            required
          />
        </Form.Group>

        <div className="d-flex gap-1 justify-content-end">
          <Button type="submit" variant="primary">
            입력
          </Button>

          <Button variant="secondary" onClick={handleClick}>
            취소
          </Button>
        </div>
      </Form>
    </>
  );
}
