import { useEffect, useRef, useState } from "react";
import ProfilerService from "../../services/ProfilerService";
import styles from "./users.module.css"
import { useNavigate } from "react-router-dom";
import Spinner from "../Utils/Spinner";


const LIMIT = 20;

export default function UsersTable({ collId, filters }) {
    const [users, setUsers] = useState([]);
    const [areMore, setAreMore] = useState(true);
    const [offset, setOffset] = useState(LIMIT);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const tableRef = useRef(null);

    function retrieveUsers() {
        const newOffset = offset + LIMIT;
        setLoading(true);
        ProfilerService.findUsers(collId, LIMIT, newOffset, filters)
            .then(data => {
                setUsers((prevUsers) => [...prevUsers, ...data.users]);
                setAreMore(data.hasMore);
                setOffset(newOffset);
                setLoading(false);
            });
    }
    useEffect(() => {
        setOffset(LIMIT);
        setLoading(true);
        ProfilerService.findUsers(collId, LIMIT, 0, filters)
            .then(data => {
                data && setUsers(data.users);
                setAreMore(data.hasMore);
                setLoading(false);
                tableRef.current.scrollTo(0, 0);
            });
    }, [filters, collId]);

    function handleScroll() {
        const table = tableRef.current;
        if (table.scrollHeight - table.scrollTop <= table.clientHeight + 100 && !loading) {
            areMore && retrieveUsers();
        }
    }
    function handleNavigation(user) {
        if (window.innerWidth < 750) {
            navigate("users/" + user.id, { state: user });
        }
    }
    return (
        <div className={styles.infoUsers}>
            <>
                <div className={styles.pagination} onScroll={handleScroll} ref={tableRef}>
                    <table aria-errormessage="error-access">
                        <thead className={styles.stickyHeader}>
                            <tr >
                                <th style={{ width: "10%" }}>Id</th>
                                <th style={{ width: "10%" }}>Edad</th>
                                <th style={{ width: "15%" }}>Género</th>
                                <th className={styles.prescindible}>Publicaciones</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {users?.map((user, index) => (
                                <tr className={styles.tr} key={index}
                                    // className={styles.userRow}
                                    onClick={() => handleNavigation(user)}
                                >
                                    <th style={{ width: "10%" }}>
                                        {typeof user.id === "string" ? user.id.substring(0, 10) : user.id}
                                    </th>
                                    <th style={{ width: "10%" }}>{user.edad}</th>
                                    <th style={{ width: "15%" }}>{user.genero}</th>
                                    <th className={styles.prescindible}>
                                        <a style={{ cursor: "pointer" }}
                                            onClick={() => navigate("users/" + user.id, { state: user })}>
                                            {user.posts[0].length > 50 ?
                                                user.posts[0].substring(0, 50) + "..." : user.posts[0]}
                                        </a>
                                    </th>
                                </tr>))}
                        </tbody>
                    </table>
                    <Spinner condition={loading} leftSpace={false} />
                </div>
            </>
        </div>
    );
}
