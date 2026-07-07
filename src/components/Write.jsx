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
    image: null,
  });
  const [removeImage, setRemoveImage] = useState(false); // 기존이미지 삭제 여부

  useEffect(() => {
    if (isModifyMode && boardId) {
      // boardId로 서버에 글 조회, 조회결과로 content 업데이트
      axios
        .get(`${API_URL}/view?id=${boardId}`)

        .then(response => {
          console.log(response.data); //[{..}]
          // setContent(response.data);

          // data가 없거나 data의 배열의 개수가 0가 같다면
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
            image_path: data.image_path || "", // 기존 이미지
            image: null, // 새 이미지
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

  const validate = e => {
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
  const createFormData = (validatedData, id) => {
    const formData = new FormData();

    formData.append("writer", validatedData.name);
    formData.append("title", validatedData.title);
    formData.append("content", validatedData.content);

    if (id) {
      formData.append("id", id);
    }
    if (content.image) {
      // 새 이미지
      formData.append("image", content.image);
    }
    if (removeImage) {
      // 기존 이미지 지운다 true
      formData.append("remove_image", "1");
    }

    return formData;
  };
  const write = e => {
    e.preventDefault();

    const validatedData = validate(e);

    if (!validatedData) return;

    const formData = createFormData(validatedData);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    axios
      .post(`${API_URL}/write`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

    const validatedData = validate(e);

    console.log(validatedData);

    if (!validatedData) return;

    const formData = createFormData(validatedData, boardId);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    axios
      .post(`${API_URL}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
  const handleImageChange = e => {
    const file = e.target.files[0];

    setContent(prev => ({
      ...prev,
      image: file,
    }));
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

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>이미지 첨부</Form.Label>

          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

        {content.image_path && (
          <div>
            <img
              src={`${API_URL}/${content.image_path}`}
              alt={content.title}
              style={{ maxWidth: "200px" }}
            />

            <Form.Check // prettier-ignore
              type="checkbox"
              id={`default-check`}
              label="기존이미지 제거"
              onChange={e => {
                setRemoveImage(e.target.checked);
              }}
            />
          </div>
        )}

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
