import { useContext, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { Store } from "../Store";
import { useChangePasswordMutation } from "../hooks/UserHooks";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import { useNavigate } from "react-router-dom";


export default function ChangePasswordPage(){
    const {
        state: {
          userInfo,
        }
      } = useContext(Store);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [ email ] = useState(userInfo.email);

    const { mutateAsync: changePasswordMutation, isLoading} = useChangePasswordMutation();

    const navigate = useNavigate()


    const handleSubmit = async () => {
        if(newPassword === confirmNewPassword){
            try {
                await changePasswordMutation({email, currentPassword, newPassword});
                toast.success("Change Password Successful");
                navigate('/dashboard');
            } catch (error) {
                toast.error(`Invalid Current Password`);
            }
        }else {
            toast.error(`Passwords do not match`)
        }
       
    };

    return(
        <Form>
            <Form.Group controlId="formCurrentPassword">
                <Form.Label>Current Password:</Form.Label>
                <Form.Control className="mb-3" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
                <Form.Label>New Password:</Form.Label>
                <Form.Control className="mb-3" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </Form.Group>
            <Form.Group  controlId="formConfirmPassword">
                <Form.Label>Confirm New Password:</Form.Label>
                <Form.Control className="mb-3" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            </Form.Group>
            <Button className="mt-3" variant="primary" disabled={isLoading} onClick={handleSubmit} >
                Change Password {isLoading ? (<LoadingBox/>): null}
            </Button>
        </Form>
    );
}