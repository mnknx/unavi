use bevy::prelude::*;
use bevy_rapier3d::prelude::*;

mod avatar;
mod player;
mod settings;
mod world;

const FIXED_TIMESTEP: f32 = 1.0 / 60.0;

pub struct StartOptions {
    pub asset_folder: String,
    pub callback: Option<Box<dyn FnOnce(&mut App)>>,
}

impl Default for StartOptions {
    fn default() -> Self {
        Self {
            asset_folder: "assets".to_string(),
            callback: None,
        }
    }
}

pub fn start(options: StartOptions) {
    let mut app = App::new();

    app.add_plugins((
        DefaultPlugins
            .set(WindowPlugin {
                primary_window: Some(Window {
                    fit_canvas_to_parent: true,
                    ..default()
                }),
                ..default()
            })
            .set(AssetPlugin {
                asset_folder: options.asset_folder,
                ..default()
            }),
        RapierPhysicsPlugin::<NoUserData>::default(),
        RapierDebugRenderPlugin::default(),
        avatar::AvatarPlugin,
        world::WorldPlugin,
        settings::SettingsPlugin,
        player::PlayerPlugin,
        // bevy::diagnostic::LogDiagnosticsPlugin::default(),
        // bevy::diagnostic::FrameTimeDiagnosticsPlugin::default(),
    ))
    .insert_resource(FixedTime::new_from_secs(FIXED_TIMESTEP));

    if let Some(callback) = options.callback {
        callback(&mut app);
    }

    app.run();
}
