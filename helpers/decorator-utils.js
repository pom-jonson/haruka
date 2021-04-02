import merge from "lodash/merge";
import uniqBy from "lodash/uniqBy";
import get from "lodash/get";

export const enhancer = (target, additionalMember) => ({
  ...target,
  elements: uniqBy([...additionalMember, ...target.elements], "key")
});

export const retrieveOriginalFunc = ({
  from,
  funcName,
  bindTo,
  funcPath = "descriptor.value"
}) => {
  const fn = get(from.elements.find(({ key }) => key === funcName), funcPath);
  if (!fn) return new Function();
  return fn.bind(bindTo);
};

export const defineMember = ([key, value], option = {}) => {
  const defaultOption = { placement: "prototype", kind: "method" };
  const { kind, placement } = { ...defaultOption, ...option };
  let content;

  switch (kind) {
    case "method":
      content = {
        descriptor: {
          value
        }
      };
      break;
    case "field":
      content = {
        initializer: value
      };
      break;
  }

  const base = {
    descriptor: {
      writable: true,
      enumerable: true,
      configurable: true
    },
    kind,
    key,
    placement
  };

  return merge(base, content);
};
