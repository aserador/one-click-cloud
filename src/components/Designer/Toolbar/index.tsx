import React, { ReactNode, useCallback, useState } from 'react';
import {
  HomeIcon,
  ChevronDownIcon,
  TextBoxIcon,
  HandToolIcon,
  CommentIcon,
  ForwardSlash,
  DebugIcon,
  ClockIcon,
} from '../icons';
import { useReactFlow } from 'reactflow';

function setButtonStyle(activeButtonId: string, isActive: boolean) {
  const button = document.getElementById(activeButtonId);
  if (!button) {
    return;
  }
  if (isActive) {
    button.classList.add('toolbar-button-active');
  } else {
    button.classList.remove('toolbar-button-active');
  }
}

interface ToolbarButtonProps {
  buttonName: string;
  width?: string;
  onButtonClick: (buttonName: string) => void;
  children?: ReactNode;
}

function ToolbarButton({
  buttonName, width = 'w-10', onButtonClick, children = null,
}: ToolbarButtonProps) {
  return (
    <button
      id={buttonName}
      type="button"
      className={`${width} h-full flex flex-col justify-center items-center bg-transparent hover:bg-black`}
      onClick={() => onButtonClick(buttonName)}
    >
      {children}
    </button>
  );
}

interface ToolbarProps {
  projectFolder?: string;
  projectName?: string;
}

function Toolbar({ projectFolder = '[Project Folder]', projectName = '[Project Name]' }: ToolbarProps) {
  const [activeButtonId, setActiveButtonId] = useState<string>('');

  const updateActiveButton = useCallback((newActiveButtonId: string) => {
    setButtonStyle(activeButtonId, false);
    setButtonStyle(newActiveButtonId, true);
    setActiveButtonId(newActiveButtonId);
  }, [activeButtonId]);

  const { setViewport, getViewport, fitView } = useReactFlow();

  return (
    <div id="toolbar" className="w-full h-12 flex flex-row justify-center items-center bg-figmaGrey">
      {/* <a href="/" className="text-2xl font-logo text-stratusPurple p-1.5">stratus</a> */}
      <div className="inline-block h-full flex flex-row">
        <ToolbarButton
          buttonName="home"
          width="w-12"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <div className="w-full h-full flex flex-row justify-center items-center">
            <HomeIcon />
            <ChevronDownIcon />
          </div>
        </ToolbarButton>
        <ToolbarButton
          buttonName="text_box"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <TextBoxIcon />
        </ToolbarButton>
        <ToolbarButton
          buttonName="zoom_out"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            const viewPort = getViewport();
            setViewport({
              ...viewPort,
              zoom: Math.max(viewPort.zoom - 0.1, 0.25),
            });
          }}
        >
          <HandToolIcon />
        </ToolbarButton>
        <ToolbarButton
          buttonName="zoom_in"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            const viewPort = getViewport();
            setViewport({
              ...viewPort,
              zoom: Math.min(viewPort.zoom + 0.1, 5),
            });
          }}
        >
          <CommentIcon />
        </ToolbarButton>
        <ToolbarButton
          buttonName="fit_view"
          onButtonClick={(newActiveButtonId: string) => {
            updateActiveButton(newActiveButtonId);
            fitView()
            console.log(getViewport())
          }}
        ><CommentIcon /></ToolbarButton>
      </div>
      <div className="flex-1" />
      <div className="inline-block h-full flex flex-row justify-center items-center">
        <a href="/" className="text-sm my-1 text-textWhite">{projectFolder}</a>
        <ForwardSlash />
        <a href="/" className="text-sm my-1 text-textWhite">{projectName}</a>
      </div>
      <div className="flex-1" />
      <div className="inline-block h-full flex flex-row justify-center items-center mr-2">
        <ToolbarButton
          buttonName="debug"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <ClockIcon />
        </ToolbarButton>
        <ToolbarButton
          buttonName="history"
          onButtonClick={(newActiveButtonId: string) => updateActiveButton(newActiveButtonId)}
        >
          <DebugIcon />
        </ToolbarButton>
        <button type="button" className="btn btn-sm bg-stratusPurple text-textWhite hover:bg-stratusPurpleActive mx-4">
          Publish
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
