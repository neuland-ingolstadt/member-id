{
  description = "Member ID GraphQL server";

  inputs = {
    naersk.url = "github:nix-community/naersk/master";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, naersk }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        naersk-lib = pkgs.callPackage naersk { };
        name = "member-id";

        rustBuild = naersk-lib.buildPackage {
          src = ./.;
          buildInputs = with pkgs; [ openssl pkg-config perl ];
          nativeBuildInputs = with pkgs; [ pkg-config perl ];
        };

        # Create a directory structure for resources in the Docker image
        resourcesDir = pkgs.runCommand "resources" {} ''
          mkdir -p $out/resources
          cp ${./resources}/* $out/resources/
        '';

        dockerImage = pkgs.dockerTools.buildImage {
          name = name;
          tag = "latest";
          copyToRoot = [ pkgs.cacert resourcesDir ];
          config = {
            Entrypoint = [ "${rustBuild}/bin/${name}" ];
            ExposedPorts = { "8000/tcp" = {}; };
            WorkingDir = "/";  # Set working directory to root so relative paths work
            Env = [
              "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
            ];
          };
        };
      in
      {
        defaultPackage = rustBuild;
        packages = {
          default = rustBuild;
          member-id = rustBuild;
          dockerImage = dockerImage;
        };

        defaultApp = {
          type = "app";
          program = "${rustBuild}/bin/${name}";
        };
      });
}