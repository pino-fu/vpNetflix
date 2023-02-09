import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TitleList.css"

export const TitleList = () => {
    const [titles, setTitles] = useState([])
    const [exclude, setExclude] = useState(0)
    const [searchTerms, setSearchTerms] = useState({
        query: "",
        type: ""
    })

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()

    const queryLimit = 100

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "692a3bc309msh31d29e11c582aa5p1aa1c6jsn45689d696937");
    myHeaders.append("X-RapidAPI-Host", "unogsng.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    useEffect(
        () => {

            fetch(`https://unogsng.p.rapidapi.com/search?orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    setTitles(data.results)
                })
        },
        []
    )

    useEffect(
        () => {

            fetch(`https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0&&query=${searchTerms.query}&type=${searchTerms.type}&countrylist=`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    if (exclude) {
                        const filtered = data.results.filter(title => !title.clist.includes(VPNetflixUserObject.country))
                        setTitles(filtered)
                    } else {
                        setTitles(data.results)
                    }
                })
        },
        [searchTerms, exclude]
    )

    return (<>
        <div className="formContainer">
            <article className="searchInput">
                <input className="searchBar"
                    onChange={
                        (changeEvent) => {
                            const copy = { ...searchTerms }
                            copy.query = changeEvent.target.value
                            setSearchTerms(copy)
                        }
                    }
                    type="text" placeholder="Search the Globe" />
            </article>
            <article className="titleDropdown">
                <select onChange={(event) => {
                    const copy = { ...searchTerms }
                    copy.type = event.target.value
                    setSearchTerms(copy)
                }
                }
                    id="titleType">
                    <option className="option" value={""}>Filter by Type</option>
                    <option
                        value={""}>
                        All
                    </option>
                    <option
                        value={"movie"}>
                        Movies
                    </option>
                    <option
                        value={"series"}>
                        Series
                    </option>
                </select>
            </article>
            <article className="titleDropdown">
                <select onChange={(event) => {
                    setExclude(parseInt(event.target.value))
                }}
                    id="titleExclude">
                    <option className="option" value={0}>Exclude {VPNetflixUserObject.country}</option>
                    <option
                        value={0}>
                        Off
                    </option>
                    <option
                        value={1}>
                        On
                    </option>
                </select>
            </article>
        </div>
        <article className="titleCardContainer">
            {
                titles.map(
                    (title) => {
                        return <section className="titleCard"
                            key={title.nfid}
                            id={title.nfid}
                            onClick={() => navigate(`details/${title.nfid}`)}
                        >
                            <img
                                src={title.img}
                                className="titleImage"
                                alt="titleCardImage"
                            />
                        </section>
                    }
                )
            }
        </article>
    </>
    )
}

