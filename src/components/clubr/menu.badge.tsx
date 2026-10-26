import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ListedBadges } from '@/data/list_tvl/list.badges';
import TrrailList from './trail.list';

interface ViewHeaderProps {
    src: string;
}

export default function ViewBadgeObt({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [emblems, setEmblems] = useState<string[]>([]);
    const [shuffledBadgesAbove80, setShuffledBadgesAbove80] = useState<any[]>([]);
    const [shuffledBadgesBelow80, setShuffledBadgesBelow80] = useState<any[]>([]);
    const [hasShuffled, setHasShuffled] = useState(false);
    const [numberbadge, setnumberbadge] = useState<{ id: string; quantity: number }[]>([]);

    const handleBadgeClick = (badge: any) => {
        setSelectedBadge(badge);
    };

    const badgesAbove80 = ListedBadges.filter((badge: any) => badge.level >= 80 && badge.level <= 100);
    const badgesBelow80 = ListedBadges.filter((badge: any) => badge.level < 80);

    function shuffleArray(array: any[]) {
        return array.sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        if (!hasShuffled) {
            setShuffledBadgesAbove80(shuffleArray([...badgesAbove80]));
            setShuffledBadgesBelow80(shuffleArray([...badgesBelow80]));
            setHasShuffled(true);
        }

        const fetchEmblems = async () => {
            try {
                const response = await fetch(`/api/club/badge.listed?userId=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setEmblems(data.emblemIds.map((id: number) => String(id)));
                    setnumberbadge(
                        Object.entries(data.emblemCounts).map(([id, quantity]) => ({ id, quantity: Number(quantity) }))
                    );
                } else {
                    console.error('Erro ao buscar os emblemas:', data.message);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        fetchEmblems();
    }, [userId, hasShuffled]);

    const defaultBadges = shuffledBadgesBelow80.slice(0, 5); // Select first 5 badges as default

    return (
        <>
            <ContainerCB>
                <Row>
                    {defaultBadges.map((badge: any, index: number) => (
                        <Buttonx key={index}>
                            <Image
                                src={badge.badge}
                                className={emblems.includes(badge.id) ? "" : "isnotactive"}
                            />
                        </Buttonx>
                    ))}
                    <Button>
                        <ViewMoreText onClick={() => setIsOpen(true)}>
                            Ver
                        </ViewMoreText>
                    </Button>
                </Row>
            </ContainerCB>

            {isOpen && (
                <FixedB onClick={() => setIsOpen(false)}>
                    <ButtoncKise onClick={() => setIsOpen(false)}>
                        X
                    </ButtoncKise>
                    <MarginSelctB onClick={(e) => e.stopPropagation()}>
                        <CardB>
                            <Overlay>
                                <Container>
                                    <TabButtons>
                                        <img src="/nvrp/20221001_185012.png" alt="novision" height={50} />
                                    </TabButtons>
                                    <ContentJk>
                                        <h2>Emblemas</h2>
                                        <p>Obtido por níveis individuais.</p>
                                    </ContentJk>

                                    <EmblemsGrid>
                                        {shuffledBadgesBelow80.map((badge: any, index) => (
                                            <EmblemIcon key={index} onClick={() => handleBadgeClick(badge)}>
                                                <Image
                                                    className={emblems.includes(badge.id) ? "" : "isnotactive"}
                                                    src={badge.badge}
                                                />
                                            </EmblemIcon>
                                        ))}
                                    </EmblemsGrid>

                                    <ContentJk>
                                        <h2>Emblema Únicos</h2>
                                        <p>Obtido a partir de destaque na comunidade</p>
                                    </ContentJk>

                                    <EmblemsGrid>
                                        {shuffledBadgesAbove80.map((badge: any, index) => (
                                            <EmblemIcon key={index} onClick={() => handleBadgeClick(badge)}>
                                                <Image
                                                    className={emblems.includes(badge.id) ? "" : "isnotactive"}
                                                    src={badge.badge}
                                                />
                                            </EmblemIcon>
                                        ))}
                                    </EmblemsGrid>
                                </Container>
                            </Overlay>
                        </CardB>

                        <CardA>
                            <TrrailList
                                badge={selectedBadge}
                                nbadge={numberbadge.find((item) => item.id === String(selectedBadge?.id))?.quantity || 0}
                                selectid={emblems.includes(String(selectedBadge?.id))}
                            />
                        </CardA>
                    </MarginSelctB>
                </FixedB>
            )}
        </>
    );
}

const ButtoncKise = styled.div`
    display: none;

    @media screen and (max-width: 530px) {
        display: block;
        position: fixed;
        cursor: var(--f-cursor-pointer);
        right: 14px;
        top: 9px;
        font-family: 'InterSemiBold', monospace;
        font-size: 16px;
        color: #46494b;
    }
`;

const ContainerCB = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    align-self: flex-end;
    padding-bottom: 4px;
    margin-right: 4px;
    padding-top: 3px;
    width: 100%;

    @media screen and (max-width: 530px) {
        align-self: flex-start;
        padding: 0;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;

    @media screen and (max-width: 530px) {
        gap: 0px;
        margin-left: -0.8em;
    }
`;

const Buttonx = styled.button`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 60px;
`;

const Button = styled.button`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 60px;
    width: 60px;
    border: 4px solid #1a1b1b;
    transition-duration: 200ms;
    border-radius: 50%;
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

const ViewMoreText = styled.div`
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.3);
    font-family: 'InterSemiBold', sans-serif;
    font-weight: bold;
    font-size: 15px;
    transition-duration: 200ms;
    margin-top: -1px;

    ${Button}:hover & {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const Image = styled.div<ViewHeaderProps>`
    width: 64px;
    height: 64px;
    object-fit: contain;
    opacity: 0.6;
    border: none;
    background-image: ${({ src }) => `url('${src}')`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    image-resolution: 95190;
    image-rendering: pixelated;

    @media screen and (max-width: 530px) {
        height: 55px;
        width: 55px;
    }

    &.isnotactive {
        filter: grayscale(100%) brightness(0);
    }
`;

const ContentJk = styled.div`
    padding: 1em 0 1em;

    h2 {
        font-family: 'InterSemiBold', monospace;
        font-size: 18px;
        color: #e2e6eb;
    }

    p {
        font-family: 'ProximaNova-Italic', monospace;
        font-size: 12px;
        text-transform: uppercase;
        color: #989da3;
    }
`;

const CardB = styled.div`
    width: 368px;
    height: 100%;
    background: linear-gradient(204deg, #1c1d1cfd -7%, #b85cff00 33%), linear-gradient(162deg, #292e2b40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1c1d1cfd, #202020fc);
    border-radius: 13px 0 0 13px;
    overflow-y: auto;

    @media screen and (max-width: 530px) {
        border-radius: 0;
        margin-top: -0.1em;
    }
`;

const CardA = styled.div`
    width: 368px;
    height: 100%;
    background: linear-gradient(204deg, #1c1d1cfd -7%, #b85cff00 33%), linear-gradient(162deg, #292e2b40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1c1d1cfd, #202020fc);
    border-radius: 0 13px 13px 0;
    overflow-y: auto;

    @media screen and (max-width: 530px) {
        border-radius: 0;
        padding: 0 0 0.2em;
    }
`;

const Overlay = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    max-width: 368px;
    overflow: auto;
    padding: 1em;
    background: var(--overlay-primary-black);

    @media screen and (max-width: 530px) {
        padding: 0.3em;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px 16px 0;
`;

const TabButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    border-bottom: 1px solid var(--tertiary-white);
`;

const EmblemsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
`;

const EmblemIcon = styled.div`
    cursor: pointer;
    border-radius: 50%;
    height: 70px;
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99);

    .isnotactive {
        filter: grayscale(100%) brightness(0);
    }

    img {
        height: 60px;
        width: 60px;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const FixedB = styled.div`
    position: fixed;
    width: 100%;
    right: 0;
    z-index: 9830;
    background-color: rgba(0, 0, 0, 0.589);
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: start;
    padding: 1em;

    @media screen and (max-width: 530px) {
        justify-content: center;
        padding: 0;
    }
`;

const MarginSelctB = styled.div`
    display: flex;
    align-items: top;
    flex-direction: row;

    @media screen and (max-width: 530px) {
        flex-direction: column-reverse;
    }
`;