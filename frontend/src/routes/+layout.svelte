<script>
  import '../app.css';

	import { AppBar, AppLayout, NavItem } from "svelte-ux";
  import { page } from '$app/stores';
	import Header from "./Header.svelte";
	import { uaccount } from '$lib/pocketbase';
</script>

<AppLayout>
  <nav slot="nav" class="h-full bg-content text-contenttext">
    <!-- Nav menu -->
    <NavItem text="Home" currentUrl={$page.url} path="/" class="flex items-center" />
    {#if !$uaccount}
      <NavItem text="Login" currentUrl={$page.url} path="/login" class="flex items-center" />
    {:else}
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
  </main>
</AppLayout>