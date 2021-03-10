import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Graph.module.css";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";
import { parseCookies } from "../utils/parser";
import { get } from "../utils/api";
import Graph from "react-graph-vis";
import FastAverageColor from "fast-average-color";

export default function GraphPage({ data }) {
  const name = data.user.display_name;
  const profileUrl = data.user.images[0].url;
  // console.log(data.artists.items);
  const art = data.artists.items.map((artist, index) => <p>{artist.name}</p>);
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState(null);
  const [options, setOptions] = useState(null);
  const [events, setEvents] = useState(null);
  const graphRef = useRef(null);

  const generateGraph = async () => {
    const fac = new FastAverageColor();
    const graph = {
      nodes: [],
      edges: [],
    };
    const options = {
      layout: {
        hierarchical: false,
      },
      edges: {
        color: {
          inherit: "both",
        },
        smooth: true,
        arrows: {
          to: {
            enabled: false,
          },
        },
        width: 2,
      },
      height: "1100px",
      nodes: {
        shape: "circularImage",
        //size: 12,
      },
      physics: {
        minVelocity: -1,
      },
    };
    const events = {
      select: (event) => {
        var { nodes, edges } = event;
      },
      zoom: (event) => {
        if (event.scale < 0.5) {
          event.scale = 0.5;
          console.log(event.scale);
        }
      },
    };

    var genres = {};

    for (var i = 0; i < data.artists.items.length; i++) {
      const artist = data.artists.items[i];
      console.log(artist.name)
      console.log(artist.genres)
      artist.genres.forEach((genre) => {
        if (!(genre in genres)) {
          genres[genre] = [];
        }
        genres[genre].push(i);
      });
      const image = artist.images[2].url;
      const color = await fac.getColorAsync(image);
      graph.nodes.push({
        id: i,
        label: artist.name,
        title: artist.name,
        size: 40 - i / 2,
        image: image,
        color: color.hex,
        font: {
          size: 10,
          color: color.hex,
        },
      });
    }
    
    for (let key in genres) {
      const arr = genres[key];
      for (var i = 0; i < arr.length - 1; i++) {
        graph.edges.push({
          from: arr[i],
          to: arr[i + 1],
        });
      }
    }
    console.log("done");
    setGraph(graph);
    setOptions(options);
    setEvents(events);
  };

  useEffect(() => {
    generateGraph();
  }, []);

  useEffect(() => {
    if (graph) {
      setLoading(false);
    }
  }, [graph]);

  return (
    <>
      <Navbar name={name} profileUrl={profileUrl} />
      <div className={styles.container}>
        {loading ? (
          <div className = {styles.loader}>
            <Loading />
          </div>
        ) : (
          <Graph
            className={styles.graph}
            graph={graph}
            options={options}
            events={events}
            ref={graphRef}
          />
        )}
      </div>
    </>
  );
}

GraphPage.getInitialProps = async ({ req }) => {
  console.log("GOT HERE")
  const data = parseCookies(req);
  console.log(data)
  const config = {
    headers: { Authorization: `Bearer ${data["access_token"]}` },
    params: {
      limit: 50,
    },
  };
  const user = await get("https://api.spotify.com/v1/me", "", config);
  const artists = await get(
    "http://api.spotify.com/v1/me/",
    "top/artists",
    config
  );
  return {
    data: {
      user: user,
      artists: artists,
    },
  };
};
