{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Native dependencies
  buildInputs = with pkgs; [
    nodejs_20 # Using Node.js version 20 LTS
    yarn      # Using Yarn as the package manager
    git       # Include git for version control
  ];

  # Automatically start the dev server when entering the shell
  shellHook = ''
    echo "Starting UFO Flight Simulator."
    npm install
    PORT=3001 yarn start & # Set port and run in background
    echo "Development server started in the background."
    echo "You can view the app in your browser at http://localhost:3001."
  '';
}
