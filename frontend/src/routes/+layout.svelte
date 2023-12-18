<script>
  import '../app.css';

	import { AppBar, AppLayout, NavItem } from "svelte-ux";
  import { page } from '$app/stores';
	import Header from "./Header.svelte";
	import { uaccount } from '$lib/pocketbase';
  import { SvelteToast } from '@zerodevx/svelte-toast'
  </script>

<AppLayout>
  <nav slot="nav" class="h-full bg-content text-contenttext">
    <!-- Nav menu -->
    <NavItem text="Home" currentUrl={$page.url} path="/" class="flex items-center" />
    {#if !$uaccount}
      <NavItem text="Login" currentUrl={$page.url} path="/login" class="flex items-center" />
    {:else}
      <NavItem text="Media Lists" currentUrl={$page.url} path="/lists" class="flex items-center" />
      <NavItem text="Logout" currentUrl={$page.url} path="/logout" class="flex items-center" />
    {/if}
  </nav>

  <AppBar class="bg-base text-basetext">
    <div slot="title">
      <a href="/">MediaLove</a>
    </div>
    <div slot="actions">
      <!-- App actions -->
    </div>
  </AppBar>
  <main class="text-contenttext p-2">
    <slot />
    <SvelteToast options={{classes: ["toaster"], duration: 2000  }} />
  </main>
</AppLayout>


<style lang="postcss">
  :root {
    --toastContainerTop: auto;
    --toastContainerRight: auto;
    --toastContainerBottom: 0;
    --toastContainerLeft: calc(50vw - 8rem);
  }
  :global(.toaster.success) {
    --toastColor: hsl(var(--suc));
    --toastBackground: hsl(var(--su));
    --toastBarBackground: hsl(var(--suc));
    font-weight: bold;
  }
  :global(.toaster.info) {
    --toastColor: hsl(var(--inc));
    --toastBackground: hsl(var(--in));
    --toastBarBackground: hsl(var(--inc));
    font-weight: bold;
  }
  :global(.toaster.warn) {
    --toastColor: hsl(var(--wac));
    --toastBackground: hsl(var(--wa));
    --toastBarBackground: hsl(var(--wac));
    font-weight: bold;
  }
  :global(.toaster.error) {
    ---toastColor: #bbb;
    --toastBackground: IndianRed;
    --toastBarBackground: #bbb;
    font-weight: bold;
  }
  </style>