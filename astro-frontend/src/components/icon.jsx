// Renders a Font Awesome icon definition as an inline SVG.
const Icon = ({ icon, fixedWidth = false, className }) => {
  const [width, height, , , paths] = icon.icon;
  const classes = ["svg-inline--fa", `fa-${icon.iconName}`];
  if (fixedWidth) classes.push("fa-fw");
  if (className) classes.push(className);

  return (
    <svg
      class={classes.join(" ")}
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      role="img"
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
    >
      {[].concat(paths).map((d) => (
        <path fill="currentColor" d={d} />
      ))}
    </svg>
  );
};

export default Icon;
