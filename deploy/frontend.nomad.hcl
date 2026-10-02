# Static frontend served at https://<hostname>/app/ on the same origin as Spacey.
# Routing below is the platform proposal in cs403bkk-2026/spacey#202, to be agreed with #201.
#
# Container contract: the image serves the built files over plain HTTP on port 8080 at "/"
# (Traefik strips the /app prefix before forwarding), and answers GET / with 200.

variable "image" {
  type = string
}

variable "hostname" {
  type = string
}

variable "revision" {
  type = string
}

job "spacey-frontend" {
  datacenters = ["cs403bkk"]
  namespace   = "frontend"
  type        = "service"

  meta {
    revision = var.revision
  }

  group "web" {
    count = 1

    constraint {
      attribute = "${node.unique.name}"
      value     = "cs403bkk-nomad-1"
    }

    update {
      max_parallel      = 1
      health_check      = "checks"
      min_healthy_time  = "10s"
      healthy_deadline  = "2m"
      progress_deadline = "4m"
      auto_revert       = true
    }

    network {
      port "http" {
        to = 8080
      }
    }

    task "web" {
      driver = "docker"

      config {
        image = var.image
        ports = ["http"]
      }

      env {
        APP_REVISION = var.revision
      }

      resources {
        cpu    = 100
        memory = 64
      }

      service {
        name     = "spacey-frontend"
        port     = "http"
        provider = "nomad"

        tags = [
          "traefik.enable=true",
          # Only /app and /app/... reach this job; every other path stays on Spacey.
          # The longer rule outranks Spacey's Host-only rule; priority makes that explicit.
          format("traefik.http.routers.spacey-frontend.rule=Host(`%s`) && (Path(`/app`) || PathPrefix(`/app/`))", var.hostname),
          "traefik.http.routers.spacey-frontend.priority=100",
          "traefik.http.routers.spacey-frontend.entrypoints=websecure",
          "traefik.http.routers.spacey-frontend.tls=true",
          "traefik.http.routers.spacey-frontend.tls.certresolver=letsencrypt",
          "traefik.http.routers.spacey-frontend.middlewares=spacey-frontend-slash,spacey-frontend-strip",
          # Bare /app -> /app/ so relative asset URLs resolve under the base path.
          "traefik.http.middlewares.spacey-frontend-slash.redirectregex.regex=^https://([^/]+)/app$",
          "traefik.http.middlewares.spacey-frontend-slash.redirectregex.replacement=https://$${1}/app/",
          "traefik.http.middlewares.spacey-frontend-slash.redirectregex.permanent=true",
          "traefik.http.middlewares.spacey-frontend-strip.stripprefix.prefixes=/app",
        ]

        check {
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
