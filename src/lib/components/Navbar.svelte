<script>
    import { onMount } from "svelte";
    import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink } from "sveltestrap";
    import { page } from "$app/stores";

    let isOpen = false;

    const toggle = () => isOpen = !isOpen;
    const update = (event) => isOpen = event.detail.isOpen;

    const links = [
        { href: "/map", label: "Map" },
    ];


</script>

<Navbar color="light" light expand="md">
    <NavbarBrand href="/">T Tracker</NavbarBrand>
    <NavbarToggler on:click={toggle}/>
    <Collapse {isOpen} navbar expand="md" on:update={update}>
        <Nav class="me-auto" navbar>
            {#each links as link, i (i)}
                <NavItem>
                    <NavLink href={link.href} active={$page.url.pathname === link.href}>Map</NavLink>
                </NavItem>
            {/each}
        </Nav>
    </Collapse>
</Navbar>