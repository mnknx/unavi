import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useIdenticon } from "ui";
import { useScene } from "ceramic";

interface Props {
  id: string;
}

export default function WorldCard({ id }: Props) {
  const { scene } = useScene(id);
  const identicon = useIdenticon(id);

  if (!scene) return <></>;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined">
        <Link href={`/home/world/${id}`} passHref>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140px"
              image={scene?.image ?? identicon}
            />
            <CardContent style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}>
              <Typography>{scene?.name}</Typography>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}
