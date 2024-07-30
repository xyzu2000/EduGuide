import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { UserContext } from '../../context/UserContext';
import "./detail.css";
const Detail = () => {
    const { data } = useContext(ChatContext);
    const [open, setOpen] = useState(false)
    const { getUserPhotoURL } = useContext(UserContext);
    const [photoURL, setPhotoURL] = useState(null);


    useEffect(() => {
        const fetchPhotoURL = async () => {
            if (data.user && data.user.uid) {
                const url = await getUserPhotoURL(data.user.uid);
                setPhotoURL(url);
            }
        };

        fetchPhotoURL();
    }, [data.user, getUserPhotoURL]);
    const handleOptions = () => {
        setOpen((state) => { setOpen(!state) })
    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={photoURL} alt="" />
                <h2>{data.user.displayName}</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores fugit nihil ducimus iure eaque, porro necessitatibus odio recusandae voluptatibus nesciunt. Laudantium, eos similique! Ipsa consequatur obcaecati quia, recusandae eos iure!</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option" onClick={handleOptions}>
                    <div className="title">
                        <span>Shared photos</span>
                        <img src={open ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
                    </div>
                    {open && <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img
                                    src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                                    alt=""
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>}
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button>Block User</button>
            </div>
        </div>
    )
}

export default Detail