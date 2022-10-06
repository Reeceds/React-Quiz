import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./PersonalDetails.scss";

import { db } from "../../config/firebase-config";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export default function PersonalDetails() {
    const [details, setDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        alias: "",
    });
    const [validated, setValidated] = useState(false);
    let [formHeight, setformHeight] = useState();

    let navigate = useNavigate();

    // Varialbes of users details in localstorage
    let fName = localStorage.getItem("firstName");
    let lName = localStorage.getItem("lastName");
    let emailAddress = localStorage.getItem("email");
    let alias = localStorage.getItem("alias");

    useEffect(() => {
        setDetails({
            firstName: fName,
            lastName: lName,
            email: emailAddress,
            alias: alias,
        });
    }, []);

    useEffect(() => {
        setformHeight(document.querySelector("form").offsetHeight);
    }, [details]);

    // Updates users alias in db/local storage
    const updateUserAlias = async (userEmail) => {
        const q = query(collection(db, "users"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        let userDocId;

        querySnapshot.forEach((doc) => {
            userDocId = doc.id;
        });

        const userDocRef = doc(db, "users", userDocId);

        await updateDoc(userDocRef, {
            alias: details.alias,
        });

        localStorage.setItem("alias", details.alias);
    };

    // Checks if form is valid and updates db/navigates to requested page
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        // Checks if form is valid
        if (form.checkValidity() === true) {
            // Updates users alias in db/local storage
            updateUserAlias(emailAddress);

            // navigates to requested page
            navigate("/");
        }

        setValidated(true);
    };

    return (
        <Row>
            <Col lg={6}>
                <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ height: formHeight }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="text" placeholder={details.email || ""} disabled />
                        <Form.Text className="text-muted"> We'll never share your email with anyone else.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder={details.firstName || ""} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder={details.lastName || ""} disabled />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" value={details.lastName || ''} onChange={(e) => setDetails({...details, lastName: (e.target.value)})} />
                    </Form.Group> */}

                    <Form.Group className="mb-3">
                        <Form.Label>Quiz Alias</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter quiz alias"
                            minLength={3}
                            maxLength={3}
                            required
                            value={details.alias || ""}
                            onChange={(e) =>
                                setDetails({
                                    ...details,
                                    alias: e.target.value.toUpperCase(),
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Please enter an alias.</Form.Control.Feedback>
                        <Form.Text className="text-muted"> Your quiz alias must be three characters long.</Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}
