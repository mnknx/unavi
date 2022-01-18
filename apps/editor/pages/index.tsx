import { useEffect, useState } from "react";
import { Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useRouter } from "next/router";
import { customAlphabet } from "nanoid";

import SceneCard from "../src/ui/components/SceneCard";
import SidebarLayout from "../src/layouts/SidebarLayout";

const nanoid = customAlphabet("1234567890", 16);

export default function Scenes() {
  const router = useRouter();

  const [scenes, setScenes] = useState([]);

  async function handleNewScene() {
    const id = nanoid();

    const str = localStorage.getItem("scenes");
    const list = JSON.parse(str) ?? [];
    list.push(id);
    localStorage.setItem("scenes", JSON.stringify(list));

    localStorage.setItem(`${id}-name`, "New Scene");

    router.push(`/scene/${id}`);
  }

  useEffect(() => {
    const str = localStorage.getItem("scenes") ?? "[]";
    const list = JSON.parse(str);
    setScenes(list);
  }, []);

  return (
    <div>
      <Grid className="page" container direction="column" rowSpacing={4}>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h2">🌲 Scenes</Typography>

            <span>
              <Tooltip title="New Scene">
                <IconButton onClick={handleNewScene}>
                  <AddBoxOutlinedIcon />
                </IconButton>
              </Tooltip>
            </span>
          </Stack>
        </Grid>

        <Grid item>
          {!scenes || scenes.length === 0 ? (
            <div>
              <Typography>
                It looks like you don{"'"}t have any scenes.
              </Typography>
              <Typography>
                <Typography
                  className="link"
                  color="secondary"
                  component="span"
                  onClick={handleNewScene}
                >
                  Click Here
                </Typography>{" "}
                to get started.
              </Typography>
            </div>
          ) : (
            <Grid container spacing={3}>
              {scenes.map((id) => {
                return <SceneCard key={id} id={id} />;
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

Scenes.Layout = SidebarLayout;