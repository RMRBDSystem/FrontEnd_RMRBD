import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import Cookies from 'js-cookie';
import { saveReportImage } from '../../services/ReportService';
import { saveReport } from '../../services/ReportService';
import { redirect } from 'react-router-dom';


const ReportPage = () => {
    const imageInput = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [UserId, setUserId] = useState('');

    useEffect(() => {
        const storedUserId = Cookies.get('UserId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !content) {
            alert("Vui lớng nhập đầy đủ thống tin");
            return;
        }
        const report = {
            CustomerId: UserId,
            Title: title,
            Content: content,
            Status: -1
        };



        try {
            const response = await saveReport(report);

            if (!response) {
                alert("Báo cáo thất bại");
                return;
            }

            if (image) {
                const responseImage = await saveReportImage(response.feedBackId, image);
                if (responseImage) {
                    alert("Báo cáo thành công");

                    window.location.href = '/listreport';
                }

            } else {
                alert("Báo cáo thành công");
                window.location.href = '/listreport';
            }
        } catch (error) {
            alert("Báo cáo thất bại");
        }
    };

    return (
        <div className="report-page container text-center">
            <h1 className="mb-4"><strong>Gửi ý kiến</strong></h1>
            <form onSubmit={handleSubmit} className="needs-validation was-validated" noValidate>
                <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label">Tiêu đề:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        className="form-control"
                        placeholder="Tiêu đề"
                        aria-required="true"
                        aria-invalid={title === ""}
                    />
                    {title === "" && (
                        <div className="invalid-feedback">Vui lòng nhập tiêu đề</div>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="content" className="form-label">Nội dung:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        required
                        className="form-control"
                    />
                    {content === "" && (
                        <div className="invalid-feedback">Vui lòng nhập nội dung</div>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="image" className="form-label">Gửi ảnh (tùy chọn): </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={(event) => setImage(event.target.files[0])}
                        accept="image/*"
                        className="form-control-file"
                        ref={imageInput}
                    />
                    {image && (
                        <div className="mt-3">
                            <img src={URL.createObjectURL(image)} alt="Uploaded Image" style={{ width: "100px", height: "100px" }} />
                            <button className="btn btn-danger btn-sm" onClick={() => {
                                setImage(null);
                                imageInput.current.value = '';
                            }}>Clear Image</button>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg">Gửi báo cáo</button>
                <a href="/listreport" className="btn btn-danger btn-lg">Xem lịch sử báo cáo</a>
            </form>
        </div>
    );
};

export default ReportPage;