export interface ThreeJSProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
}

export const threeJSProjects: ThreeJSProject[] = [
  {
    id: "proj-001",
    slug: "interactive-particle-field",
    title: "Interactive Particle Field",
    description: "A GPU-accelerated particle system that reacts to mouse movement, creating dynamic visual effects.",
    category: "Generative Art",
  },
  {
    id: "proj-002",
    slug: "procedural-terrain-generation",
    title: "Procedural Terrain Generation",
    description: "Using Perlin noise to generate infinite, realistic landscapes with customizable parameters.",
    category: "World Building",
  },
  {
    id: "proj-003",
    slug: "shader-art-gallery",
    title: "Shader Art Gallery",
    description: "A collection of GLSL shaders demonstrating complex patterns, fractals, and lighting effects.",
    category: "Shader Programming",
  },
];
