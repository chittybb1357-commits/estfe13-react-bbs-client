import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Write({ isModifyMode, boardId }) {
  let navigate = useNavigate();

  const onSubmit = e => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/write", {
        name: e.target.name.value,
        title: e.target.title.value,
        content: e.target.content.value,
      })
      .then(response => {
        navigate("/");
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {});
  };

  return (
    <>
      <h2 className="mb-3">{isModifyMode ? "글수정" : "글쓰기"}</h2>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>글쓴이</Form.Label>

          <Form.Control type="text" name="name" placeholder="이름을 입력해주세요" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>

          <Form.Control type="text" name="title" placeholder="제목을 입력해주세요" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>

          <Form.Control as="textarea" name="content" rows={3} />
        </Form.Group>

        <div className="d-flex gap-1 justify-content-end">
          <Button type="submit" variant="primary">
            입력
          </Button>

          <Button variant="secondary">취소</Button>
        </div>
      </Form>
    </>
  );
}
