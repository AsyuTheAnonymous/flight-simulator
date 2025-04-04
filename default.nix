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
    echo "Entering Nix shell for Flight Simulator..."
    echo "Starting development server with 'yarn start' on port 3001..."
    # Ensure we are in the correct directory relative to where nix-shell is run
    # Assuming nix-shell is run from /home/asyu/Documents/Projects/flight-simulator
    PORT=3001 yarn start & # Set port and run in background
    echo "Development server started in the background."
    echo "You can view the app in your browser at http://localhost:3001."
  '';
}
