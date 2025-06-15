import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(),sveltekit()],
	server:{
		allowedHosts:['5173-09liweis-realtorservice-c99bqlwpu9d.ws-us120.gitpod.io','5174-09liweis-realtorservice-c99bqlwpu9d.ws-us120.gitpod.io']
	}
});
